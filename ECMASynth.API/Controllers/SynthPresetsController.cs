using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ECMASynth.API.Models;
using ECMASynth.API.Data;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ECMASynth.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SynthPresetsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public SynthPresetsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/SynthPresets
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SynthPreset>>> GetPresets()
        {
            return await _context.SynthPresets.ToListAsync();
        }

        // GET: api/SynthPresets/5
        [HttpGet("{id}")]
        public async Task<ActionResult<SynthPreset>> GetPreset(int id)
        {
            var preset = await _context.SynthPresets.FindAsync(id);

            if (preset == null)
            {
                return NotFound();
            }

            return preset;
        }

        // POST: api/SynthPresets
        [HttpPost]
        public async Task<ActionResult<SynthPreset>> CreatePreset(SynthPreset preset)
        {
            preset.CreatedAt = System.DateTime.UtcNow;
            preset.UpdatedAt = System.DateTime.UtcNow;
            
            _context.SynthPresets.Add(preset);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPreset), new { id = preset.Id }, preset);
        }

        // PUT: api/SynthPresets/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePreset(int id, SynthPreset preset)
        {
            if (id != preset.Id)
            {
                return BadRequest();
            }

            preset.UpdatedAt = System.DateTime.UtcNow;
            _context.Entry(preset).State = EntityState.Modified;
            _context.Entry(preset).Property(x => x.CreatedAt).IsModified = false;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PresetExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/SynthPresets/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePreset(int id)
        {
            var preset = await _context.SynthPresets.FindAsync(id);
            if (preset == null)
            {
                return NotFound();
            }

            _context.SynthPresets.Remove(preset);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PresetExists(int id)
        {
            return _context.SynthPresets.Any(e => e.Id == id);
        }
    }
} 