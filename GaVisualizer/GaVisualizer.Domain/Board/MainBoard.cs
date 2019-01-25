using System.Collections.Generic;

namespace GaVisualizer.Domain.Board
{
    public class MainBoard
    {
        IReadOnlyList<BoardCell> Cells { get; set; }
    }
}
