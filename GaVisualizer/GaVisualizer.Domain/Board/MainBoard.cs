using System;

namespace GaVisualizer.Domain.Board
{
    public class MainBoard : ICloneable
    {
        public Guid AlgorithmId { get; set; }

        public int Width { get; set; }
        public int Height { get; set; }

        public IBoardElement[,] Cells { get; set; }

        public object Clone()
        {
            return MemberwiseClone();
        }
    }
}
