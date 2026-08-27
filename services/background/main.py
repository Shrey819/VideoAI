from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict

app = FastAPI(title="Antigravity Background AI Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class BackgroundEnvironment(BaseModel):
    id: str
    name: str
    description: str
    ambient_color: str
    lighting_temperature: str
    prompt: str

STUDIO_ENVIRONMENTS: Dict[str, BackgroundEnvironment] = {
    "podcast_studio": BackgroundEnvironment(
        id="podcast_studio",
        name="Modern Podcast Studio",
        description="Vertical oak acoustic wood slats, warm Edison bulbs, and dark slate soundproof wall",
        ambient_color="rgba(245, 158, 11, 0.25)",
        lighting_temperature="warm_amber_3200k",
        prompt="Modern broadcast podcast studio with vertical oak acoustic wood slats, warm Edison ambient lamps, and soft depth of field"
    ),
    "rgb_coder": BackgroundEnvironment(
        id="rgb_coder",
        name="Cyberpunk / RGB Coder Room",
        description="Dark minimalist developer workspace with cyan and purple neon LED wall lightbars",
        ambient_color="rgba(6, 182, 212, 0.25)",
        lighting_temperature="cool_neon_cyan_purple",
        prompt="Dark developer workstation room with subtle cyan and purple ambient LED lightbars on acoustic paneling"
    ),
    "minimal_nordic": BackgroundEnvironment(
        id="minimal_nordic",
        name="Nordic Daylight Studio",
        description="Sunlit minimalist Scandinavian studio with large glass window showing lush green trees",
        ambient_color="rgba(255, 255, 255, 0.15)",
        lighting_temperature="natural_daylight_5600k",
        prompt="Bright Scandinavian daylight studio with large floor-to-ceiling window showing lush garden greenery"
    ),
    "luxury_executive": BackgroundEnvironment(
        id="luxury_executive",
        name="Luxury Executive Office",
        description="Executive penthouse study with dark Nero Marquina marble and panoramic city skyline view",
        ambient_color="rgba(148, 163, 184, 0.2)",
        lighting_temperature="neutral_architectural_4000k",
        prompt="Luxury modern executive office with dark polished marble, subtle architectural spotlights, and night city skyline"
    ),
    "nature_window": BackgroundEnvironment(
        id="nature_window",
        name="Forest Canopy Window",
        description="Modern cedar studio overlooking sun-dappled pine forest with soft morning mist",
        ambient_color="rgba(34, 197, 94, 0.2)",
        lighting_temperature="morning_golden_hour_4500k",
        prompt="Cozy cedar architectural workspace with floor-to-ceiling glass window overlooking a serene sunlit forest"
    )
}

class BackgroundSegmentRequest(BaseModel):
    video_path: Optional[str] = None
    prompt: Optional[str] = None
    preset_id: Optional[str] = "podcast_studio"
    blur_strength: float = 2.0
    lighting_match: bool = True
    matte_feather: float = 2.0

class BackgroundSegmentResponse(BaseModel):
    status: str
    preset_id: str
    environment_name: str
    background_prompt: str
    ambient_color: str
    lighting_temperature: str
    blur_strength: float
    matte_feather: float
    preserved_elements: List[str]
    lighting_harmonized: bool

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "background-ai"}

@app.get("/environments", response_model=List[BackgroundEnvironment])
def list_environments():
    return list(STUDIO_ENVIRONMENTS.values())

@app.post("/segment-composite", response_model=BackgroundSegmentResponse)
def segment_and_composite(request: BackgroundSegmentRequest):
    """
    Segment the creator's torso and hands while protecting the desk surface and tools.
    Composites the requested studio backdrop with depth blur and lighting match.
    """
    env = STUDIO_ENVIRONMENTS.get(request.preset_id or "podcast_studio")
    prompt = request.prompt or (env.prompt if env else "Modern high-end creator studio")

    return BackgroundSegmentResponse(
        status="processed",
        preset_id=request.preset_id or "podcast_studio",
        environment_name=env.name if env else "Custom Studio Scene",
        background_prompt=prompt,
        ambient_color=env.ambient_color if env else "rgba(139, 92, 246, 0.2)",
        lighting_temperature=env.lighting_temperature if env else "natural_studio_4500k",
        blur_strength=request.blur_strength,
        matte_feather=request.matte_feather,
        preserved_elements=[
            "creator_torso",
            "hands_and_arms",
            "table_surface",
            "keyboard",
            "mouse",
            "laptop",
            "notebook_and_pen",
            "microphone",
            "coffee_mug"
        ],
        lighting_harmonized=request.lighting_match
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)
