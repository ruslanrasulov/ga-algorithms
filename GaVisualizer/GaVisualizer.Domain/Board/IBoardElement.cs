using GaVisualizer.Domain.Elements;

namespace GaVisualizer.Domain.Board
{
    public interface IBoardElement
    {
        double FitnessValue { get; set; }
        double SocialValue { get; set; }
        ElementType ElementType { get; }
    }
}
