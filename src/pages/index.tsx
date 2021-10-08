export default function Home(props) {
  return (
    <div>
      <h1>
        Content
      </h1>
      <p>
        {}
        {JSON.stringify(props.episodes)}
      </p>
    </div>
  )
}

// SSR
// export async function getServerSideProps() {
//   const response = await fetch('http://localhost:3333/episodes')
//   const episodes = await response.json()

//   return {
//     props: {
//       episodes
//     }
//   }
// }

// SSG
export async function getStaticProps() {
  const response = await fetch('http://localhost:3333/episodes')
  const episodes = await response.json()

  return {
    props: {
      episodes
    },
    revalidate: 60
  }
}
