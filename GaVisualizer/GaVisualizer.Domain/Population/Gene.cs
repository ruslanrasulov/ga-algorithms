using System;

namespace GaVisualizer.Domain.Population
{
    public class Gene<T>
    {
        public T Value { get; set; }
        public Guid ParentId { get; set; }
        public bool IsMutated { get; set; }
    }
}
