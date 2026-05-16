import { useEffect, useRef, useState } from "react";
import { productsApi } from "../lib/api";

/**
 * Fetch a paginated/filtered list of products from the API.
 * Returns { products, loading, error }.
 */
export function useProducts(params = {}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Stable serialised key so the effect only re-runs when params actually change
  const paramsKey = JSON.stringify(params);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    productsApi
      .getAll(params)
      .then((res) => {
        if (!cancelled) {
          setProducts(res.data ?? []);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsKey]);

  return { products, loading, error };
}

/**
 * Fetch a single product by id or slug.
 * Returns { product, loading, error }.
 */
export function useProduct(idOrSlug) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!idOrSlug) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    productsApi
      .getById(idOrSlug)
      .then((data) => {
        if (!cancelled) {
          setProduct(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [idOrSlug]);

  return { product, loading, error };
}
