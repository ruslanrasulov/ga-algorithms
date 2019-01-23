using static System.Console;

namespace GeneticAlgorithms.ConsoleApp
{
    internal sealed class Program
    {
        private const int IterationCount = 16834;
        private static readonly string DivisionLine = new string('-', 25);

        private static void Main(string[] args)
        {
            while (true)
            {
                Clear();
                Write("Target value: ");

                var targetValue = ReadLine();
                var ga = new GeneticAlgorithm(targetValue, IterationCount);
                var counter = 0;

                foreach (var current in ga.StartEvolution())
                {
                    WriteLine($"{counter++}){current.Value} ({current.FitnessValue})");
                }

                WriteLine(DivisionLine);
                WriteLine("Done !");

                ReadKey();
            }
        }
    }
}
