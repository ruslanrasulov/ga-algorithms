using GaVisualizer.BusinessLogic.Processing;
using Microsoft.Extensions.DependencyInjection;

namespace GaVisualizer.BusinessLogic
{
    public static class ServiceRegistrator
    {
        public static IServiceCollection AddBusinessLogic(this IServiceCollection services)
        {
            services.AddSingleton<IGeneticAlgorithmProcessor, GeneticAlgorithmProcessor>();

            return services;
        }
    }
}
