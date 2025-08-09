import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req) {
  try {
    const { message } = await req.json();

    const completion = await openai.chat.completions.create({
    //   model: "gpt-4o-mini", // cheaper + fast
    //   model: "gpt-5-nano", // cheaper + fast
      model: "gpt-5-mini", // cheaper + fast
      messages: [{ role: "user", content: message }],
    });

    return new Response(
      JSON.stringify({ reply: completion.choices[0].message.content }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Something went wrong" }), { status: 500 });
  }
}
