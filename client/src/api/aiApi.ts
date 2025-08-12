// api/aiApi.ts
export const aiApi = {
  generateIdiomData: async (title: string) => {
    const res = await fetch("http://localhost:5000/api/ai/generate-idiom", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });

    if (!res.ok) {
      throw new Error("Failed to generate idiom data");
    }

    const { data } = await res.json();
    return data;
  },
};
