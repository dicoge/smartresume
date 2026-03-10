import re
import os
import sys
import json

def update_ts_project(ts_path, project_id, updates):
    with open(ts_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 尋找特定的專案物件
    # 範例: { id: 'scalpingTrade', ... }
    pattern = rf"(\{{\s+id:\s+'{project_id}',.*?\s+\}})"
    match = re.search(pattern, content, re.DOTALL)
    
    if not match:
        print(f"Error: Project ID '{project_id}' not found in TS file.")
        return False

    project_str = match.group(1)
    new_project_str = project_str
    
    for key, val in updates.items():
        if key == 'tags' or key == 'stats':
            # 更新陣列格式
            formatted_val = str(val).replace('"', "'")
            new_project_str = re.sub(rf"{key}: \[.*?\]", f"{key}: {formatted_val}", new_project_str)
        else:
            # 更新字串格式
            new_project_str = re.sub(rf"{key}: '[^']*'", f"{key}: '{val}'", new_project_str)
    
    new_content = content.replace(project_str, new_project_str)
    
    with open(ts_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    return True

def update_md_log(md_path, project_id, updates):
    if not os.path.exists(md_path):
        with open(md_path, 'w', encoding='utf-8') as f:
            f.write("# Project Archive Log\n\n")

    with open(md_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 如果專案標題已存在，則更新，否則在最後面新增
    title_pattern = rf"## Project: {project_id}"
    if title_pattern in content:
        # 這裡只是簡單地在該區塊下方追加更新紀錄 (Log 模式)
        update_entry = f"\n- **Update Log**: {json.dumps(updates, ensure_ascii=False)}"
        new_content = re.sub(rf"(## Project: {project_id}.*?)(?=\n## Project:|$)", rf"\1{update_entry}", content, flags=re.DOTALL)
    else:
        new_content = content + f"\n\n## Project: {project_id}\n- **Initial Entry**: {json.dumps(updates, ensure_ascii=False)}"

    with open(md_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    return True

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python3 patch_project.py <project_id> <json_updates>")
        sys.exit(1)
    
    pid = sys.argv[1]
    upd = json.loads(sys.argv[2])
    
    ts_file = "src/data/projects.ts"
    md_file = "ref_src/projects.md"
    
    if update_ts_project(ts_file, pid, upd) and update_md_log(md_file, pid, upd):
        print(f"Successfully updated Project '{pid}'.")
    else:
        sys.exit(1)
