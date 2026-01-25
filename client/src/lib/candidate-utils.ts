
export function getCandidateImage(candidate: { image?: string; gender?: string }): string {
    if (candidate.image && candidate.image.trim() !== "") {
        return candidate.image;
    }

    const gender = candidate.gender?.toLowerCase() || "";

    if (gender === "female") {
        return "/assets/candidate_female.png";
    }

    // Default to male image for "Male" or any other unspecified gender
    return "/assets/candidate_male.png";
}
