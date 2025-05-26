using Ambev.DeveloperEvaluation.Application.Infrastructure.Interface;
using Confluent.Kafka;
using Microsoft.Extensions.Configuration;
using System.Text.Json;
using System.Threading.Tasks;

namespace Ambev.DeveloperEvaluation.Application.Infrastructure
{
    /// <summary>
    /// Implements <see cref="IKafkaProducer"/> to produce and publish messages to Kafka topics.
    /// </summary>
    public class KafkaProducer : IKafkaProducer
    {
        private readonly IProducer<Null, string> _producer;

        /// <summary>
        /// Initializes a new instance of the <see cref="KafkaProducer"/> class.
        /// </summary>
        /// <param name="configuration">The application configuration used to get Kafka settings.</param>
        public KafkaProducer(IConfiguration configuration)
        {
            var config = new ProducerConfig
            {
                BootstrapServers = configuration["Kafka:BootstrapServers"],
                MessageTimeoutMs = 5000
            };

            _producer = new ProducerBuilder<Null, string>(config).Build();
        }

        /// <summary>
        /// Publishes a message asynchronously to the specified Kafka topic.
        /// The message is serialized to JSON before sending.
        /// </summary>
        /// <typeparam name="T">The type of the message to be published.</typeparam>
        /// <param name="topic">The Kafka topic to which the message will be published.</param>
        /// <param name="message">The message to publish.</param>
        /// <returns>A task representing the asynchronous publish operation.</returns>
        public async Task PublishAsync<T>(string topic, T message)
        {
            var json = JsonSerializer.Serialize(message);
            await _producer.ProduceAsync(topic, new Message<Null, string> { Value = json });
        }
    }
}
