namespace GaVisualizer.Domain.Board
{
    public class BoardCell
    {
        public int X { get; set; }
        public int Y { get; set; }

        public double Temperature { get; set; }

        public IBoardElement Element { get; set; }
    }
}
