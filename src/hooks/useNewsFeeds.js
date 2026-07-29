// fetches all three regional feeds (your country / us / international) and
// manages which tab is selected. pulled out into its own hook so both the
// Feed screen and the Help screen can share the same data instead of each
// fetching it separately

import { useState, useEffect, useCallback } from 'react';
import { fetchByCountry, fetchInternational, getUserCountryCode } from '../api/newsApi';

export function useNewsFeeds() {
  const [feeds, setFeeds] = useState({ local: [], us: [], international: [] });
  const [availableRegions, setAvailableRegions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const loadAllFeeds = useCallback(async () => {
    setErrorMessage(null);

    const userCountryCode = getUserCountryCode();
    const showLocalTab = userCountryCode && userCountryCode !== 'us';

    const results = await Promise.allSettled([
      showLocalTab ? fetchByCountry(userCountryCode) : Promise.resolve([]),
      fetchByCountry('us'),
      fetchInternational(),
    ]);

    const [localResult, usResult, internationalResult] = results;

    const nextFeeds = {
      local: localResult.status === 'fulfilled' ? localResult.value : [],
      us: usResult.status === 'fulfilled' ? usResult.value : [],
      international: internationalResult.status === 'fulfilled' ? internationalResult.value : [],
    };

    const nextRegions = [];
    if (showLocalTab && nextFeeds.local.length > 0) {
      nextRegions.push({ key: 'local', label: 'Your country' });
    }
    if (nextFeeds.us.length > 0) {
      nextRegions.push({ key: 'us', label: 'US' });
    }
    if (nextFeeds.international.length > 0) {
      nextRegions.push({ key: 'international', label: 'International' });
    }

    if (nextRegions.length === 0) {
      setErrorMessage("Couldn't load news from any region right now.");
    }

    setFeeds(nextFeeds);
    setAvailableRegions(nextRegions);
    setSelectedRegion((current) =>
      nextRegions.some((region) => region.key === current) ? current : nextRegions[0]?.key
    );
  }, []);

  useEffect(() => {
    loadAllFeeds().finally(() => setIsLoading(false));
  }, [loadAllFeeds]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadAllFeeds();
    setIsRefreshing(false);
  };

  return {
    feeds,
    availableRegions,
    selectedRegion,
    setSelectedRegion,
    isLoading,
    isRefreshing,
    errorMessage,
    handleRefresh,
  };
}