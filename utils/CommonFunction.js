
import { useRef, useEffect } from 'react';

export function calculateImageText(lastName, firstName) {
  if (lastName === '') {
    return firstName.substring(0, 2);
  } else {
    return (firstName[0] + lastName[0]);
  }
}

export function getSectionListData(data) {
  let categories = [];
  data.forEach((item) => {
    if (!categories.includes(item.category)) {
      categories.push(item.category);
    }
  });

  let sections = [];
  data.forEach((item) => {
    sections.push({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      imageFileName: item.imageFileName
    });
  });

  return sections;
}

export function useUpdateEffect(effect, dependencies = []) {
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      return effect();
    }
  }, dependencies);
}
