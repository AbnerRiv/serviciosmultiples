using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Middleware
{
    public class RefererCheckMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly HashSet<string> _allowedReferers;
        private readonly IWebHostEnvironment _env;

        public RefererCheckMiddleware(RequestDelegate next, IConfiguration configuration, IWebHostEnvironment env)
        {
            _next = next;
            _env = env;
            _allowedReferers = configuration.GetSection("AllowedReferers").Get<HashSet<string>>()!;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            if (_env.IsDevelopment())
            {
                // If in development, skip the referer check
                await _next(context);
                return;
            }

            var referer = context.Request.Headers["Referer"].ToString();

            if (string.IsNullOrEmpty(referer) || !_allowedReferers.Any(r => referer.StartsWith(r, StringComparison.OrdinalIgnoreCase)))
            {
                context.Response.StatusCode = StatusCodes.Status403Forbidden;
                await context.Response.WriteAsync("Forbidden: Invalid Referer");
                return;
            }

            await _next(context);
        }
    }
}