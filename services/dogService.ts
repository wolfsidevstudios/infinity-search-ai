
export interface DogData {
  imageUrl: string;
  breed: string;
}

export const fetchRandomDog = async (): Promise<DogData | null> => {
  try {
    const response = await fetch('https://dog.ceo/api/breeds/image/random');
    if (!response.ok) return null;
    
    const data = await response.json();
    if (data.status === 'success') {
      // Extract breed from URL structure: https://images.dog.ceo/breeds/beagle/n02088364_12995.jpg
      const urlParts = data.message.split('/');
      // Breed is typically the index before the filename
      const breedSegment = urlParts[urlParts.length - 2]; 
      const breed = breedSegment.split('-').map((s: string) => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
      
      return {
        imageUrl: data.message,
        breed: breed
      };
    }
    return null;
  } catch (error) {
    console.error("Dog API Error:", error);
    return null;
  }
};
