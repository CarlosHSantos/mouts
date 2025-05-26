namespace Ambev.DeveloperEvaluation.Application.Infrastructure.Interface
{
    /// <summary>
    /// Defines a contract for producing and publishing messages to a Kafka topic.
    /// </summary>
    public interface IKafkaProducer
    {
        /// <summary>
        /// Publishes a message asynchronously to the specified Kafka topic.
        /// </summary>
        /// <typeparam name="T">The type of the message to be published.</typeparam>
        /// <param name="topic">The Kafka topic to which the message will be published.</param>
        /// <param name="message">The message to publish.</param>
        /// <returns>A task representing the asynchronous publish operation.</returns>
        Task PublishAsync<T>(string topic, T message);
    }
}
