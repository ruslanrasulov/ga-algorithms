using System.Collections.Generic;
using System.Threading.Tasks;
using GaVisualizer.Domain.Algorithm;
using GaVisualizer.Domain.Population;

namespace GaVisualizer.BusinessLogic.Processing
{
    public interface IGeneticAlgorithmProcessor
    {
        Task<GeneticAlgorithm> AddNewAlgorithmAsync(AlgorithmSettings settings);
        Task<GeneticAlgorithm> GetCurrentStateAsync(string id);
        Task RemoveAsync(string id);
        Task<GeneticAlgorithm> StopAsync(string id);
        Task<IEnumerable<GeneticAlgorithm>> GetAlgorithmsAsync();
    }
}
