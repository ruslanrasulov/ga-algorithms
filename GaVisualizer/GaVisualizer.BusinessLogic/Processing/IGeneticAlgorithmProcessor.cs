using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using GaVisualizer.BusinessLogic.Algorithm;
using GaVisualizer.Domain.Board;

namespace GaVisualizer.BusinessLogic.Processing
{
    public interface IGeneticAlgorithmProcessor
    {
        Task<GeneticAlgorithm> AddNewAlgorithmAsync(BoardSettings settings);
        Task<MainBoard> GetCurrentStateAsync(string id);
        Task RemoveAsync(string id);
        Task StopAsync(string id);
        Task<IEnumerable<MainBoard>> GetAlgorithmsAsync();
    }
}
