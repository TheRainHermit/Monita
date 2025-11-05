import { useState, useEffect } from "react";
import buildQuery from "../utils/buildQuery";

const BASE_URL = "http://localhost:8000/energia";

export function useEnergiaSummary(params) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    const query = buildQuery(params);
    fetch(`${BASE_URL}/consumo/summary?${query}`)
      .then(res => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [JSON.stringify(params)]);

  return { data, loading, error };
}

export function useEnergiaTimeSeries(params) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    const query = buildQuery(params);
    fetch(`${BASE_URL}/consumo/timeseries?${query}`)
      .then(res => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [JSON.stringify(params)]);

  return { data, loading, error };
}

export function useEnergiaZonas(params) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    const query = buildQuery(params);
    fetch(`${BASE_URL}/consumo/zonas?${query}`)
      .then(res => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [JSON.stringify(params)]);

  return { data, loading, error };
}

export function useEnergiaAnomalies(params) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    const query = buildQuery(params);
    fetch(`${BASE_URL}/consumo/anomalies?${query}`)
      .then(res => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [JSON.stringify(params)]);

  return { data, loading, error };
}

export function useEnergiaComparativa(params) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    const query = buildQuery(params);
    fetch(`${BASE_URL}/consumo/comparativa?${query}`)
      .then(res => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [JSON.stringify(params)]);

  return { data, loading, error };
}

export function useEnergiaDatasets() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(`${BASE_URL}/datasets`)
      .then(res => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

export function useEnergiaRaw(params) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    const query = buildQuery(params);
    fetch(`${BASE_URL}/consumo/raw?${query}`)
      .then(res => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [JSON.stringify(params)]);

  return { data, loading, error };
}

export function useEnergiaZonasDistinct() {
  const [zonas, setZonas] = useState([]);
  useEffect(() => {
    fetch(`${BASE_URL}/zonas/distinct`)
      .then(res => res.json())
      .then(data => setZonas(data.zonas || []));
  }, []);
  return zonas;
}

export function useEnergiaTiposUsuarioDistinct() {
  const [tipos, setTipos] = useState([]);
  useEffect(() => {
    fetch(`${BASE_URL}/tipos_usuario/distinct`)
      .then(res => res.json())
      .then(data => setTipos(data.tipos_usuario || []));
  }, []);
  return tipos;
}