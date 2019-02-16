using System.Collections.Generic;

namespace GaVisualizer.Domain.Board
{
    public class MainBoard
    {
        public int Width { get; set; }
        public int Height { get; set; }

        IReadOnlyList<BoardCell> Cells { get; set; }
    }
}
