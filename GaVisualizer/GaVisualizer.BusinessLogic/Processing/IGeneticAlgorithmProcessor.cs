using System.Collections.Generic;
using System.Threading.Tasks;
using GaVisualizer.Domain.Algorithm;

namespace GaVisualizer.BusinessLogic.Processing
{
    public interface IGeneticAlgorithmProcessor
    {
        Task<GeneticAlgorithm> AddNewAlgorithmAsync(AlgorithmSettings settings);
        Task<GeneticAlgorithm> GetCurrentStateAsync(string id);
        Task<GeneticAlgorithm> GetNextStateAsync(string id);
        Task RemoveAsync(string id);
        Task<GeneticAlgorithm> StopAsync(string id);
        Task<IEnumerable<GeneticAlgorithm>> GetAlgorithmsAsync();
    }
}
