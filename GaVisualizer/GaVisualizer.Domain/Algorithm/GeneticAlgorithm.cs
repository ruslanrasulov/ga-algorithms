using System;
using System.Collections.Generic;
using GaVisualizer.Domain.Population;

namespace GaVisualizer.Domain.Algorithm
{
    public class GeneticAlgorithm
    {
        public Guid Id { get; set; }
        public ICollection<Generation> Generations { get; set; }
        public bool IsStopped { get; set; }
        public bool IsPaused { get; set; }
        public bool IsStarted { get; set; }
    }
}
