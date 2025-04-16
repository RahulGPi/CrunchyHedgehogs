from google import genai
from config import API_KEY, PROMPT , GEMINI_MODEL


def algorithm():
    client = genai.Client(api_key=API_KEY)
    img_path = "landsat_copernicus_export\\downloaded_images\\copernicus_images\\Copernicus_Image_1.png"
    response = client.models.generate_content(
        model=GEMINI_MODEL,
        contents="Explain me how image coordinates work"        
    )

    # smth = dict(response.text)
    # print(smth)
    print(response.text)

if __name__ == "__main__":
    algorithm()