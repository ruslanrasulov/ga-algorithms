using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace GeneticAlgorithms.ConsoleApp
{
    internal class GeneticAlgorithm
    {
        private const int InitialPopulationCount = 2048;
        private const int SurvivalsCount = 200;
        private const double MutationChanse = 0.25;

        private static readonly Random Random = new Random();

        private readonly string targetValue;
        private readonly int maxIterationCount;
        private readonly List<Population> currentPopulations;

        public GeneticAlgorithm(string targetValue, int maxIterationCount)
        {
            currentPopulations = new List<Population>();

            this.targetValue = targetValue;
            this.maxIterationCount = maxIterationCount;
        }

        public IEnumerable<Population> StartEvolution()
        {
            InitializeFirstPopulation();

            for (int i = 0; i < maxIterationCount; i++)
            {
                currentPopulations.ForEach(p => CalculateFitnessValue(p));
                var bestPopulation = currentPopulations.OrderBy(c => c.FitnessValue).First();

                yield return bestPopulation;

                if (bestPopulation.FitnessValue == 0)
                {
                    yield break;
                }

                Mate();
            }
        }

        private void InitializeFirstPopulation()
        {
            for (int i = 0; i < InitialPopulationCount; i++)
            {
                currentPopulations.Add(new Population { Value = GetRandomValue(targetValue.Length) });
            }
        }

        private void Mate()
        {
            var survivals = currentPopulations.OrderBy(c => c.FitnessValue).Take(SurvivalsCount).ToList();

            currentPopulations.Clear();
            currentPopulations.AddRange(survivals);

            for (int i = 0; i < InitialPopulationCount - SurvivalsCount; i++)
            {
                var (motherIndex, fatherIndex) = GetIndecies(survivals.Count);

                var mother = survivals[motherIndex];
                var father = survivals[fatherIndex];

                var newValue = GenerateNewValue(mother.Value, father.Value);

                currentPopulations.Add(new Population { Value = newValue });
            }
        }

        private string GenerateNewValue(string motherValue, string fatherValue)
        {
            var parentValueCount = motherValue.Length / 2;
            var sb = new StringBuilder(targetValue.Length);

            sb.Append(motherValue.Substring(0, parentValueCount));
            sb.Append(fatherValue.Substring(parentValueCount, fatherValue.Length - parentValueCount));

            var mutationChance = Random.NextDouble();

            if (mutationChance <= MutationChanse)
            {
                sb[Random.Next(targetValue.Length)] = (char)Random.Next(short.MaxValue);
            }

            return sb.ToString();
        }

        private (int motherIndex, int fatherIndex) GetIndecies(int maxIndex)
        {
            int motherIndex;
            int fatherIndex;

            do
            {
                motherIndex = Random.Next(maxIndex);
                fatherIndex = Random.Next(maxIndex);
            }
            while (motherIndex == fatherIndex);

            return (motherIndex, fatherIndex);
        }

        private string GetRandomValue(int length)
        {
            var sb = new StringBuilder();

            for (int i = 0; i < length; i++)
            {
                sb.Append((char)Random.Next(short.MaxValue));
            }

            return sb.ToString();
        }

        private void CalculateFitnessValue(Population population)
        {
            for (int i = 0; i < population.Value.Length; i++)
            {
                population.FitnessValue += Math.Abs(targetValue[i] - population.Value[i]);
            }
        }
    }
}
