import {
  createGetRatingsRequest,
  createPostRatingsRequest,
} from "../api/rating-api.js";
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

export function useRatings() {
  const router = useRouter();
  async function getRatings(story_id) {
    const response = await createGetRatingsRequest(story_id);
    const content = await response.json();
    if (response.responseErr || content.errorMsg) {
      return router.replace({ name: "Error" });
    }
    return content;
  }

  async function addNewRating(story_id, rating, description) {
    const response = await createPostRatingsRequest(
      story_id,
      rating,
      description,
    );
    const content = await response.json();
    if (response.responseErr || content.errorMsg) {
      return router.replace({ name: "Error" });
    }
    return content;
  }

  const ratingDialog = ref(false);
  const ratingsContent = ref({
    results: [],
    is_logged_in: null,
    has_submitted_rating: null,
  });

  const ratings = computed(() => {
    return ratingsContent.value.results.map((ratingObj) => ratingObj.rating);
  });

  const ratingsAvg = computed(() => {
    const average =
      ratings.value.length === 0
        ? 0
        : ratings.value.reduce((a, b) => a + b) / ratings.value.length;
    return (Math.round(average * 100) / 100).toFixed(2);
  });

  const ratingsCount = computed(() => {
    return ratings.value.length;
  });

  return {
    getRatings,
    addNewRating,
    ratingDialog,
    ratingsContent,
    ratings,
    ratingsAvg,
    ratingsCount,
  };
}
