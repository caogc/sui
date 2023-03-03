use std::time::Duration;

use clap::Parser;
use color_eyre::eyre::{Context, Result};
use sui_benchmark::orchestrator::{
    client::{aws::AwsClient, vultr::VultrClient, Client},
    parameters::{BenchmarkParametersGenerator, LoadType},
    settings::{CloudProvider, Settings},
    testbed::Testbed,
    Orchestrator,
};

async fn execute<C: Client>(settings: Settings, client: C, opts: Opts) -> Result<()> {
    // Create a new testbed.
    let testbed = Testbed::new(settings, client)
        .await
        .wrap_err("Failed to crate testbed")?;

    // Create a new orchestrator to instruct the testbed.
    let mut orchestrator = Orchestrator::new(testbed);

    match opts.operation {
        Operation::Testbed { action } => match action {
            // Display the current status of the testbed.
            TestbedAction::Status => orchestrator.print_testbed_status(),

            // Deploy the specified number of instances on the testbed.
            TestbedAction::Deploy { instances } => orchestrator
                .deploy_testbed(instances)
                .await
                .wrap_err("Failed to deploy testbed")?,

            // Install the codebase and all dependencies on all instances.
            TestbedAction::Terraform => orchestrator
                .terraform_testbed()
                .await
                .wrap_err("Failed to terraform testbed")?,

            // Start the specified number of instances on an existing testbed.
            TestbedAction::Start { instances } => orchestrator
                .start_testbed(instances)
                .await
                .wrap_err("Failed to start testbed")?,

            // Stop an existing testbed.
            TestbedAction::Stop => orchestrator
                .stop_testbed()
                .await
                .wrap_err("Failed to stop testbed")?,

            // Destroy the testbed and terminal all instances.
            TestbedAction::Destroy => orchestrator
                .destroy_testbed()
                .await
                .wrap_err("Failed to destroy testbed")?,
        },

        // Run benchmarks.
        Operation::Benchmark {
            nodes,
            faults,
            duration,
            loads,
            skip_testbed_update,
        } => {
            let loads = if loads.is_empty() { vec![200] } else { loads };

            let generator = BenchmarkParametersGenerator::new(nodes, LoadType::Fixed(loads))
                .with_custom_duration(duration)
                .with_faults(faults);

            orchestrator
                .skip_testbed_updates(skip_testbed_update)
                .run_benchmarks(generator)
                .await
                .wrap_err("Failed to run benchmarks")?;
        }
    }
    Ok(())
}

#[tokio::main]
async fn main() -> Result<()> {
    color_eyre::install()?;
    let opts: Opts = Opts::parse();

    // Load the settings files.
    let settings = Settings::load(&opts.settings_path).wrap_err("Failed to load settings")?;

    match &settings.cloud_provider {
        CloudProvider::Aws => {
            // Create the client for the cloud provider.
            let client = AwsClient::new(settings.clone()).await;

            // Execute the command.
            execute(settings, client, opts).await
        }
        CloudProvider::Vultr => {
            // Create the client for the cloud provider.
            let token = settings
                .load_token()
                .wrap_err("Failed to load cloud provider's token")?;
            let client = VultrClient::new(token, settings.clone());

            // Execute the command.
            execute(settings, client, opts).await
        }
    }
}

#[derive(Parser)]
#[clap(name = "Testbed orchestrator")]
pub struct Opts {
    /// The path to the settings file.
    #[clap(
        long,
        value_name = "FILE",
        default_value = "crates/sui-benchmark/src/orchestrator/assets/settings.json",
        global = true
    )]
    settings_path: String,

    /// The type of operation to run.
    #[clap(subcommand)]
    operation: Operation,
}

#[derive(Parser)]
#[clap(rename_all = "kebab-case")]
pub enum Operation {
    Testbed {
        #[clap(subcommand)]
        action: TestbedAction,
    },

    /// Run a benchmark on the specified testbed.
    Benchmark {
        /// Number of nodes to deploy.
        #[clap(long, value_name = "INT")]
        nodes: usize,

        /// The fixed load (in tx/s) to submit to the nodes.
        #[clap(
            long,
            value_name = "INT",
            multiple_occurrences = false,
            multiple_values = true,
            value_delimiter = ','
        )]
        loads: Vec<usize>,

        /// Number of faulty nodes.
        #[clap(long, value_name = "INT", default_value = "0")]
        faults: usize,

        /// The duration of the benchmark in seconds.
        #[clap(long, value_parser = parse_duration, default_value = "180")]
        duration: Duration,

        #[clap(long, action, default_value = "false")]
        skip_testbed_update: bool,
    },
}

#[derive(Parser)]
#[clap(rename_all = "kebab-case")]
pub enum TestbedAction {
    /// Display the testbed status.
    Status,

    /// Create and configure a new testbed.
    Deploy {
        /// Number of instances to deploy.
        #[clap(long)]
        instances: usize,
    },

    /// Install the codebase and all dependencies on all instances.
    Terraform,

    /// Start the specified number of instances on an existing testbed.
    Start {
        /// Number of instances to deploy.
        #[clap(long)]
        instances: usize,
    },

    /// Stop an existing testbed.
    Stop,

    /// Destroy the testbed and terminate all instances.
    Destroy,
}

fn parse_duration(arg: &str) -> Result<Duration, std::num::ParseIntError> {
    let seconds = arg.parse()?;
    Ok(Duration::from_secs(seconds))
}
