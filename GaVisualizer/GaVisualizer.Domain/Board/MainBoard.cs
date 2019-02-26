using System;

namespace GaVisualizer.Domain.Board
{
    public class MainBoard
    {
        public Guid AlgorithmId { get; set; }

        public int Width { get; set; }
        public int Height { get; set; }

        public IBoardElement[,] Cells { get; set; }
    }
}
