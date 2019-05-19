using System.Threading.Tasks;
using GaVisualizer.BusinessLogic.Processing;
using GaVisualizer.Domain.Algorithm;
using GaVisualizer.Domain.Population;
using GaVisualizer.WebApi.Models;
using Microsoft.AspNetCore.Mvc;

namespace GaVisualizer.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AlgorithmsController : ControllerBase
    {
        private readonly IGeneticAlgorithmProcessor geneticAlgorithmProcessor;

        public AlgorithmsController(IGeneticAlgorithmProcessor geneticAlgorithmProcessor)
        {
            this.geneticAlgorithmProcessor = geneticAlgorithmProcessor;
        }

        [HttpPost]
        public async Task<IActionResult> AddNewAlgorithmAsync([FromBody]AlgorithmSettingsVm settingsVm = null)
        {
            var settings = GetSettings(settingsVm);
            var algorithm = await geneticAlgorithmProcessor.AddNewAlgorithmAsync(settings ?? new AlgorithmSettings());

            return Created($"api/algorithms/{algorithm.Id}", algorithm);
        }

        [HttpPatch("{id}")]
        public async Task<IActionResult> UpdateAlgorithmAsync(string id, [FromBody]AlgorithmUpdateModel updateModel)
        {
            if (updateModel.IsStopped)
            {
                return Ok(await geneticAlgorithmProcessor.StopAsync(id));
            }

            return Ok();
        }

        [HttpGet("{id}/state")]
        public async Task<IActionResult> GetCurrentStateAsync(string id)
        {
            var currentState = await geneticAlgorithmProcessor.GetCurrentStateAsync(id);

            if (currentState == null)
            {
                return NotFound();
            }

            return Ok(currentState);
        }
        
        [HttpGet]
        public async Task<IActionResult> GetAlgorithmsAsync()
        {
            var algorithms = await geneticAlgorithmProcessor.GetAlgorithmsAsync();

            return Ok(algorithms);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> RemoveAsync(string id)
        {
            await geneticAlgorithmProcessor.RemoveAsync(id);

            return Ok();
        }

        private AlgorithmSettings GetSettings(AlgorithmSettingsVm settingsVm)
        {
            var width = settingsVm.Generation.Cells.GetLength(0);
            var height = settingsVm.Generation.Cells.GetLength(1);
            var elements = new IPopulationElement[width, height];

            for (int i = 0; i < width; i++)
            {
                for (int j = 0; j < height; j++)
                {
                    if (settingsVm.Generation.Cells[i, j].ElementType == ElementType.Bacteria)
                    {
                        elements[i, j] = new Bacterium();
                    }
                    else if (settingsVm.Generation.Cells[i, j].ElementType == ElementType.Virus)
                    {
                        elements[i, j] = new Virus();
                    }
                }
            }

            return new AlgorithmSettings
            {
                InitialGeneration = new Generation
                {
                    Cells = elements
                },
                CrossoverType = settingsVm.CrossoverType,
                SelectionType = settingsVm.SelectionType,
                IterationCount = settingsVm.IterationCount,
                InitializeRandomPopulation = settingsVm.InitializeRandomPopulation
            };
        }
    }
}