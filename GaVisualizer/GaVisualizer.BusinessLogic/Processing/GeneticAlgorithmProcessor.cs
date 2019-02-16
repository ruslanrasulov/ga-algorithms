using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using GaVisualizer.BusinessLogic.Algorithm;
using GaVisualizer.Domain.Board;

namespace GaVisualizer.BusinessLogic.Processing
{
    internal class GeneticAlgorithmProcessor : IGeneticAlgorithmProcessor
    {
        private readonly IDictionary<Guid, GeneticAlgorithm> algorithms;

        public GeneticAlgorithmProcessor()
        {
            algorithms = new Dictionary<Guid, GeneticAlgorithm>();
        }

        public Task<Guid> AddNewAlgorithmAsync(BoardSettings settings)
        {
            var id = Guid.NewGuid();
            algorithms.Add(id, new GeneticAlgorithm());

            return Task.FromResult(id);
        }

        public Task<MainBoard> GetCurrentStateAsync(string id)
        {
            //TODO: implement main algorithm
            return Task.FromResult(new MainBoard());
        }
    }
}
