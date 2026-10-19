import os, re, json
from collections import defaultdict

client_dir = os.path.abspath(r'c:\Users\adhan\Downloads\HangerHome_Premium_FullStack_FULLY_UPDATED\HangerHome_Premium_FullStack\hanger-commerce\client')

# Patterns
hex_re = re.compile(r'#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b')
rgba_re = re.compile(r'\brgba?\([^)]+\)')
hsla_re = re.compile(r'\bhsla?\([^)]+\)')
css_var_def_re = re.compile(r'(--[a-zA-Z0-9_-]+)\s*:\s*([^;]+);')
css_var_use_re = re.compile(r'var\((--[a-zA-Z0-9_-]+)[^)]*\)')
gradient_re = re.compile(r'(?:linear-gradient|radial-gradient|conic-gradient)\([^)]+\)')
box_shadow_re = re.compile(r'box-shadow\s*:\s*([^;]+);')
inline_style_re = re.compile(r'style=\{\{([^}]+)\}\}')
tailwind_color_re = re.compile(r'\b(bg|text|border|ring|shadow|fill|stroke)-(\[#[0-9a-fA-F]+\]|[a-z]+-[0-9]{2,3}|black|white|transparent|emerald-[0-9]+|gold-[0-9]+)\b')
svg_fill_stroke_re = re.compile(r'\b(fill|stroke)=["\']([^"\']+)["\']')

results = {
    'files': {},
    'global_summary': {
        'total_hex_matches': 0,
        'total_rgba_matches': 0,
        'total_hsla_matches': 0,
        'total_var_defs': 0,
        'total_var_uses': 0,
        'total_gradients': 0,
        'total_box_shadows': 0,
        'total_inline_color_styles': 0,
        'total_tailwind_color_classes': 0,
        'total_svg_fills': 0,
        'hardcoded_dark_colors': defaultdict(list),
        'unique_hex_colors': defaultdict(int),
        'css_variable_definitions': {}
    }
}

DARK_HEXES = {'#04120e', '#09251f', '#0f3d2e', '#071b15', '#0a1612', '#000000', '#000', '#0d2820', '#0f241d', '#11221b', '#061a14', '#142a22'}
GOLD_HEXES = {'#e8c070', '#c9a24b', '#f5d799', '#bf9438', '#cca855', '#d4af37', '#ffd700'}

for root, dirs, files in os.walk(client_dir):
    dirs[:] = [d for d in dirs if d not in ['node_modules', 'dist', 'theme-baseline', '.git', 'coverage', 'build']]
    for file in files:
        if not file.endswith(('.css', '.jsx', '.js', '.html', '.svg')):
            continue
        filepath = os.path.join(root, file)
        relpath = os.path.relpath(filepath, client_dir)
        try:
            with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
        except Exception:
            continue

        file_hexes = hex_re.findall(content)
        file_rgbas = rgba_re.findall(content)
        file_hslas = hsla_re.findall(content)
        file_var_defs = css_var_def_re.findall(content)
        file_var_uses = css_var_use_re.findall(content)
        file_gradients = gradient_re.findall(content)
        file_shadows = box_shadow_re.findall(content)
        file_tailwind = tailwind_color_re.findall(content)
        file_svg = svg_fill_stroke_re.findall(content)

        # inline styles
        inline_matches = inline_style_re.findall(content)
        inline_color_matches = []
        for im in inline_matches:
            if any(k in im for k in ['color', 'background', 'bg', 'border', 'shadow', 'fill', 'stroke', '#', 'rgb']):
                inline_color_matches.append(im.strip())

        # check hardcoded darks & golds
        dark_occurrences = []
        for h in file_hexes:
            hl = h.lower()
            results['global_summary']['unique_hex_colors'][hl] += 1
            if hl in DARK_HEXES or (len(hl) == 7 and hl.startswith('#0') and hl[1] in '0123456789abcdef'):
                dark_occurrences.append(h)
        for r in file_rgbas:
            if '4, 18, 14' in r or '4,18,14' in r or '15, 61, 46' in r or '15,61,46' in r or '9, 37, 31' in r or '0, 0, 0' in r or '0,0,0' in r:
                dark_occurrences.append(r)

        if any([file_hexes, file_rgbas, file_hslas, file_var_defs, file_gradients, file_shadows, inline_color_matches, file_tailwind]):
            results['files'][relpath] = {
                'hex_count': len(file_hexes),
                'rgba_count': len(file_rgbas),
                'hsla_count': len(file_hslas),
                'var_defs': len(file_var_defs),
                'var_uses': len(file_var_uses),
                'gradient_count': len(file_gradients),
                'box_shadow_count': len(file_shadows),
                'inline_colors': len(inline_color_matches),
                'tailwind_classes': len(file_tailwind),
                'dark_colors': len(dark_occurrences),
                'sample_darks': list(set(dark_occurrences))[:5]
            }

            results['global_summary']['total_hex_matches'] += len(file_hexes)
            results['global_summary']['total_rgba_matches'] += len(file_rgbas)
            results['global_summary']['total_hsla_matches'] += len(file_hslas)
            results['global_summary']['total_var_defs'] += len(file_var_defs)
            results['global_summary']['total_var_uses'] += len(file_var_uses)
            results['global_summary']['total_gradients'] += len(file_gradients)
            results['global_summary']['total_box_shadows'] += len(file_shadows)
            results['global_summary']['total_inline_color_styles'] += len(inline_color_matches)
            results['global_summary']['total_tailwind_color_classes'] += len(file_tailwind)
            results['global_summary']['total_svg_fills'] += len(file_svg)

            for d in dark_occurrences:
                results['global_summary']['hardcoded_dark_colors'][relpath].append(d)

            for var_name, var_val in file_var_defs:
                results['global_summary']['css_variable_definitions'][var_name] = var_val.strip()

out_path = os.path.join(client_dir, '..', 'scratch', 'color_audit_results.json')
with open(out_path, 'w', encoding='utf-8') as f:
    json.dump(results, f, indent=2)

print(f"Audit completed. Total files with colors: {len(results['files'])}")
print(f"Total hex matches: {results['global_summary']['total_hex_matches']}")
print(f"Total rgba matches: {results['global_summary']['total_rgba_matches']}")
print(f"Total CSS variable definitions: {results['global_summary']['total_var_defs']}")
print(f"Total CSS variable usages: {results['global_summary']['total_var_uses']}")
