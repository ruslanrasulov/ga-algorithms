using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using GaVisualizer.Domain.Board;

namespace GaVisualizer.BusinessLogic.Processing
{
    public interface IGeneticAlgorithmProcessor
    {
        Task<Guid> AddNewAlgorithmAsync(BoardSettings settings);
        Task<MainBoard> GetCurrentStateAsync(string id);
        Task RemoveAsync(string id);
        Task<IEnumerable<MainBoard>> GetAlgorithmsAsync();
    }
}
