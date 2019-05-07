using System;
using System.Collections.Generic;
using GaVisualizer.Domain.Statistic;

namespace GaVisualizer.Domain.Board
{
    public class MainBoard : ICloneable
    {
        public Guid AlgorithmId { get; set; }

        public IBoardElement[,] Cells { get; set; }

        public ICollection<IterationInfo> Iterations { get; set; }

        public bool IsStopped { get; set; }

        public bool IsPaused { get; set; }

        public bool IsStarted { get; set; }

        public object Clone()
        {
            var cells = Cells.Clone() as IBoardElement[,];

            return new MainBoard
            {
                AlgorithmId = AlgorithmId,
                Cells = cells,
                Iterations = Iterations,
                IsStopped = IsStopped,
                IsPaused = IsPaused,
                IsStarted = IsStarted
            };
        }
    }
}
