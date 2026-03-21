export default function Home() {
  return (
    <>
      <head>
        <title>WojakMeter | Crypto Market Sentiment & Emotion Index</title>

        <meta name="description" content="WojakMeter tracks the emotional state of the crypto market." />

        <meta property="og:title" content="WojakMeter | The Crypto Emotion Index" />
        <meta property="og:image" content="/assets/preview.jpg" />

        <meta name="twitter:card" content="summary_large_image" />
      </head>

      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />

      <script src="/script.js?v=16"></script>
    </>
  );
}