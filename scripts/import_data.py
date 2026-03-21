import pandas as pd
import json
import re
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

PROVINCE_COORDS = {
    "กรุงเทพฯ": (13.7563, 100.5018),
    "กรุงเทพ": (13.7563, 100.5018),
    "กรุุงเทพฯ": (13.7563, 100.5018),
    "กรุุงเทพ": (13.7563, 100.5018),
    "นนทบุรี": (13.8621, 100.5144),
    "สมุทรปราการ": (13.5991, 100.5998),
    "ปทุมธานี": (14.0208, 100.5253),
    "นครปฐม": (13.8199, 100.0641),
    "เชียงใหม่": (18.7883, 98.9853),
    "เชียงราย": (19.9071, 99.8325),
    "ภูเก็ต": (7.8804, 98.3923),
    "กระบี่": (8.0863, 98.9063),
    "สุราษฎร์ธานี": (9.1382, 99.3217),
    "ชลบุรี": (13.3611, 100.9847),
    "ระยอง": (12.6814, 101.2816),
    "หัวหิน": (12.5684, 99.9578),
    "ประจวบคีรีขันธ์": (11.8126, 99.7957),
    "เพชรบุรี": (13.1119, 99.9395),
    "กาญจนบุรี": (14.0227, 99.5328),
    "นครราชสีมา": (14.9799, 102.0978),
    "ขอนแก่น": (16.4322, 102.8236),
    "อุดรธานี": (17.4156, 102.7872),
    "สงขลา": (7.1756, 100.6143),
    "หาดใหญ่": (7.0084, 100.4746),
    "พังงา": (8.4508, 98.5252),
    "ตราด": (12.2428, 102.5175),
    "สมุทรสาคร": (13.5475, 100.2746),
    "นครนายก": (14.2069, 101.2131),
    "ลพบุรี": (14.7995, 100.6534),
    "อยุธยา": (14.3532, 100.5689),
    "พระนครศรีอยุธยา": (14.3532, 100.5689),
    "สระบุรี": (14.5289, 100.9101),
    "ราชบุรี": (13.5283, 99.8134),
    "สุพรรณบุรี": (14.4744, 100.1177),
}

import random
random.seed(42)

def get_coords(province):
    if not province or pd.isna(province):
        return (13.7563, 100.5018)
    province = str(province).strip()
    if province in PROVINCE_COORDS:
        return PROVINCE_COORDS[province]
    for key, coords in PROVINCE_COORDS.items():
        if province in key or key in province:
            return coords
    return (13.7563, 100.5018)

def escape_sql(val):
    if val is None or (isinstance(val, float) and pd.isna(val)):
        return "NULL"
    s = str(val).strip()
    if not s:
        return "NULL"
    s = s.replace("'", "''")
    return f"'{s}'"

def main():
    import os
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)  # pethabitat/
    petmap_root = os.path.dirname(project_root)  # Petmap/
    excel_path = os.path.join(petmap_root, "FastWork Pet.xlsx")
    output_path = os.path.join(project_root, "supabase", "seed.sql")

    xls = pd.ExcelFile(excel_path)

    lines = ["-- PetHabitat Seed Data", "-- Auto-generated from FastWork Pet.xlsx", ""]
    lines.append("INSERT INTO places (place_type, name, province, google_maps_url, website_url, description, pet_fee, pet_condition, pet_friendly, latitude, longitude) VALUES")

    values = []

    for sheet_name in xls.sheet_names:
        df = pd.read_excel(xls, sheet_name=sheet_name)

        for _, row in df.iterrows():
            name = row.get("place_name")
            if pd.isna(name) or not str(name).strip():
                continue

            place_type = str(row.get("Place Type", sheet_name)).strip()
            province = str(row.get("place_province", "")).strip() if not pd.isna(row.get("place_province")) else ""
            ggmap = row.get("place_ggmap")
            website = row.get("place_websitelink")
            description = row.get("place_description")
            pet_fee = row.get("hotel_petfee")
            pet_condition = row.get("hotel_pet_condition")
            pet_friendly = row.get("pet_friendly")

            lat, lng = get_coords(province)
            lat += (random.random() - 0.5) * 0.02
            lng += (random.random() - 0.5) * 0.02

            values.append(
                f"({escape_sql(place_type)}, {escape_sql(name)}, {escape_sql(province)}, "
                f"{escape_sql(ggmap)}, {escape_sql(website)}, {escape_sql(description)}, "
                f"{escape_sql(pet_fee)}, {escape_sql(pet_condition)}, {escape_sql(pet_friendly)}, "
                f"{lat:.6f}, {lng:.6f})"
            )

    lines.append(",\n".join(values) + ";")
    lines.append("")
    lines.append(f"-- Total: {len(values)} places imported")

    with open(output_path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))

    print(f"Generated seed.sql with {len(values)} places")

if __name__ == "__main__":
    main()
