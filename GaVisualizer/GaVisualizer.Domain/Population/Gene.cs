using System;

namespace GaVisualizer.Domain.Population
{
    public class Gene<T>
    {
        public T Value { get; set; }
        public int ParentId { get; set; }
        public int ElementId { get; set; }
        public GeneType GeneType { get; set; }
        public bool IsMutated { get; set; }
    }
}
