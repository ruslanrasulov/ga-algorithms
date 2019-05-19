namespace GaVisualizer.Domain.Population
{
    public class Gene<T>
    {
        public T Value { get; set; }
        public int ParentX { get; set; }
        public int ParentY { get; set; }
        public bool IsMutated { get; set; }
    }
}
