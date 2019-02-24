﻿using GaVisualizer.Domain.Evolution;

namespace GaVisualizer.Domain.Board
{
    public class BoardSettings
    {
        public int Width { get; set; }
        public int Height { get; set; }
        public int BacteriasCount { get; set; }
        public int VirusCount { get; set; }
        public int IterationCount { get; set; }
        public MateType MateType { get; set; }
    }
}