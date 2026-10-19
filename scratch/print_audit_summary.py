import json

with open('scratch/color_audit_results.json', encoding='utf-8') as f:
    d = json.load(f)

print("=== COLOR AUDIT SUMMARY ===")
print("Total files examined with colors:", len(d['files']))
print("Total hex matches:", d['global_summary']['total_hex_matches'])
print("Total rgba matches:", d['global_summary']['total_rgba_matches'])
print("Total hsla matches:", d['global_summary']['total_hsla_matches'])
print("Total gradients:", d['global_summary']['total_gradients'])
print("Total box-shadows:", d['global_summary']['total_box_shadows'])
print("Total inline styles with colors:", d['global_summary']['total_inline_color_styles'])
print("Total Tailwind color classes:", d['global_summary']['total_tailwind_color_classes'])
print("Total CSS variable definitions:", d['global_summary']['total_var_defs'])
print("Total CSS variable usages:", d['global_summary']['total_var_uses'])
print("\n=== TOP 20 FILES BY COLOR OCCURRENCE ===")
sorted_files = sorted(d['files'].items(), key=lambda x: x[1]['hex_count'] + x[1]['rgba_count'], reverse=True)
for k, v in sorted_files[:20]:
    print(f"{k:<45} | hex: {v['hex_count']:3} | rgba: {v['rgba_count']:3} | darks: {v['dark_colors']:3} | inline: {v['inline_colors']:2} | var_defs: {v['var_defs']:2}")

print("\n=== HARD-CODED DARK COLORS BY FILE ===")
for path, darks in sorted(d['global_summary']['hardcoded_dark_colors'].items()):
    unique_d = set(darks)
    print(f"{path:<45} : {len(darks)} occurrences -> {list(unique_d)[:4]}")
