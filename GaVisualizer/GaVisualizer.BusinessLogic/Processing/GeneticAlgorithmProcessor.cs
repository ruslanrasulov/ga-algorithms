using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using GaVisualizer.BusinessLogic.Algorithm;
using GaVisualizer.Domain.Board;
using GaVisualizer.Domain.Elements;

namespace GaVisualizer.BusinessLogic.Processing
{
    internal class GeneticAlgorithmProcessor : IGeneticAlgorithmProcessor
    {
        private static readonly Random Random = new Random();
        private readonly IDictionary<Guid, GeneticAlgorithm> algorithms;

        public GeneticAlgorithmProcessor()
        {
            algorithms = new Dictionary<Guid, GeneticAlgorithm>();
        }

        public Task<Guid> AddNewAlgorithmAsync(BoardSettings settings)
        {
            var id = Guid.NewGuid();
            algorithms.Add(id, new GeneticAlgorithm() { Board = GetRandomBoard() });

            return Task.FromResult(id);
        }

        public Task<MainBoard> GetCurrentStateAsync(string id)
        {
            //TODO: implement main algorithm
            if (algorithms.TryGetValue(new Guid(id), out GeneticAlgorithm ga))
            {
                //returning random state by each call
                ga.Board = GetRandomBoard();
                return Task.FromResult(ga.Board);
            }

            return null;
        }

        private MainBoard GetRandomBoard()
        {
            var board = new MainBoard() { Cells = new IBoardElement[20, 20] };

            for (int i = 0; i < board.Cells.GetLength(0); i++)
            {
                for (int j = 0; j < board.Cells.GetLength(1); j++)
                {
                    var chance = Random.Next(2);
                    
                    if (chance == 1)
                    {
                        board.Cells[i, j] = new Bacteria();
                    }
                    else
                    {
                        board.Cells[i, j] = new Virus();
                    }
                }
            }

            return board;
        }
    }
}
