import { GetStaticProps } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import api from '../services/api'

import { format, parseISO } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'

import { convertDurationToTimeString } from '../utils/convertDurationToTimeString'

import styles from './home.module.scss'

import AutocorrectTextarea from './AutocorrectTextarea'

type Episode = {
  id: string,
  title: string,
  thumbnail: string,
  members: string,
  publishedAt: string,
  duration: Number,
  durationAsString: string,
  description: string,
  url: string
}

type HomeProps = {
  latestEpisodes: Episode[],
  allEpisodes: Episode[]
}

export default function Home({ latestEpisodes, allEpisodes }: HomeProps) {
  return (
    <div className={styles.homepage}>
      <section className={styles.latestEpisodes}>
        <h2>
          Últimos lançamentos
        </h2>

        <AutocorrectTextarea />

        <ul>
          {latestEpisodes.map(ep => (
            <li key={ep.id}>
              <Image
                width={192}
                height={192}
                src={ep.thumbnail}
                alt={ep.title}
                objectFit="cover"
              />

              <div className={styles.episodeDetails}>
                <Link href={`/episodes/${ep.id}`}>
                  <a>{ep.title}</a>
                </Link>
                <p>{ep.members}</p>
                <span>{ep.publishedAt}</span>
                <span>{ep.durationAsString}</span>
              </div>

              <button type="button">
                <img src="/play-green.svg" alt="Tocar episódio" />
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.allEpisodes}>
        <h2>
          Todos episódios
        </h2>

        <table
          cellSpacing={0}
        >
          <thead>
            <th></th>
            <th>Podcast</th>
            <th>Integrantes</th>
            <th>Data</th>
            <th>Duração</th>
            <th></th>
          </thead>
          <tbody>
            {
              allEpisodes.map(ep => (
                <tr
                  key={ep.id}
                >
                  <td style={{ minWidth: 72 }}>
                    <Image
                      width={120}
                      height={120}
                      src={ep.thumbnail}
                      alt={ep.title}
                      objectFit="cover"
                    />
                  </td>
                  <td>
                    <Link href={`/episodes/${ep.id}`}>
                      <a>
                        {ep.title}
                      </a>
                    </Link>
                  </td>
                  <td>{ep.members}</td>
                  <td style={{ minWidth: 100 }}>{ep.publishedAt}</td>
                  <td>{ep.durationAsString}</td>
                  <td>
                    <button type="button">
                      <img src="/play-green.svg" alt="Tocar episódio" />
                    </button>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </section>
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
export const getStaticProps: GetStaticProps = async () => {
  const { data }:any = await api.get('episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  })

  const episodes = data.map((ep:any):Episode => {
    return {
      id: ep.id,
      title: ep.title,
      thumbnail: ep.thumbnail,
      members: ep.members,
      publishedAt: format(parseISO(ep.published_at), 'd MMM yy', { locale: ptBR }),
      duration: Number(ep.file.duration),
      durationAsString: convertDurationToTimeString(Number(ep.file.duration)),
      description: ep.description,
      url: ep.file.url
    }
  })

  const latestEpisodes = episodes.slice(0, 2)
  const allEpisodes = episodes.slice(2, episodes.length)

  return {
    props: {
      latestEpisodes,
      allEpisodes
    },
    revalidate: 60 * 60
  }
}
