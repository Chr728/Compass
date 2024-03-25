'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Header from '../components/Header';
import { useAuth } from '../contexts/AuthContext';
import { useProp } from '../contexts/PropContext';
import { useUser } from '../contexts/UserContext';
import { getHealthNews } from '../http/healthNewsAPI';

export default function HealthNews() {
  const router = useRouter();
  const { user } = useAuth();
  const { handlePopUp } = useProp();
  const { userInfo } = useUser();
  const [news, setNews] = useState([]);

  useEffect(() => {
    async function fetchHealthNews() {
      try {
        const userId = user?.uid || '';
        const result = await getHealthNews();
        console.log(result.data);

        if (result.status === 'SUCCESS') {
          setNews(result.data);
        } else {
          throw new Error('Failed to fetch health news');
        }
      } catch (error) {
        console.error('Error fetching health news:', error);
        handlePopUp('error', 'Error retrieving health news.');
      }
    }

    fetchHealthNews();
  }, [user, handlePopUp]);

  function formatDate(timeString: string) {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    const date = new Date(timeString);
    const month = months[date.getMonth()];
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();

    const formattedDay =
      day +
      (day % 10 === 1 && day !== 11
        ? 'st'
        : day % 10 === 2 && day !== 12
        ? 'nd'
        : day % 10 === 3 && day !== 13
        ? 'rd'
        : 'th');

    const formattedTime = `${hour < 10 ? '0' : ''}${hour}:${
      minute < 10 ? '0' : ''
    }${minute}`;

    return `${month} ${formattedDay}, ${formattedTime}`;
  }

  return (
    <div className="relative bg-eggshell min-h-screen flex flex-col">
      <span className="flex items-baseline font-bold text-darkgrey text-2xl mx-4 mt-4 mb-4">
        <button onClick={() => router.push('/health')}>
          <Header headerText="Health News" />
        </button>
      </span>

      <div className="flex flex-col items-center justify-center">
        {news.length > 0 ? (
          <div className="flex flex-col items-center justify-center">
            {news.map((item: any, index) => (
              <div
                key={index}
                className={`my-4 ${index === news.length - 1 ? 'mb-32' : ''}`}
              >
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  <img
                    src={item.urlToImage}
                    alt={item.title}
                    className="w-full max-w-[400px] mb-2 ml-2 rounded-lg cursor-pointer"
                  />
                </a>
                <div className="text-center">
                  <h2 className="text-xl font-bold mb-1 text-darkgrey">
                    {item.title}
                  </h2>
                  <p className="text-darkgrey">{item.description}</p>
                  <p className="text-darkgrey text-sm">
                    Published on: {formatDate(item.publishedAt)}
                  </p>
                  <a
                    href={item.url}
                    className="text-darkgrey underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Read more
                  </a>
                </div>
                {index < news.length - 1 && (
                  <hr className="my-4 w-full border border-lightgrey" />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <p className="text-lg font-bold text-darkgrey mb-2">
              No health news available.
            </p>
            <p className="text-darkgrey">Please check back later.</p>
          </div>
        )}
      </div>
    </div>
  );
}
