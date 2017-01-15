package main

import "fmt"

func main() {

  fmt.Println("Hello world")

  // Const
  const (
    KB = 1024
    MB = KB * 1024
    GB = MB * 1024
    TB = GB * 1024
    PB = TB * 1024
  )
  const (
    one int = iota + 1
    two
  )
  // Strings
  myString := "I'm a string."
  myOtherString := myString + " I really am."
  fmt.Println(myOtherString)

  // Int Float
  myInt := 2
  myFloat := 1.5
  myOtherFloat := float64(myInt) * myFloat
  fmt.Println(myOtherFloat)

  // Booleans
  myBool := true
  if myBool {
    fmt.Println("myBool is true")
  } else {
    fmt.Println("myBool isn't true")
  }

  // Arrays and Slices
  mySlice := []int{1, 2, 3, 4, 5}
  mySlice2 := mySlice[0:3]
  mySlice3 := mySlice[1:4]
  fmt.Println(mySlice2, mySlice3, mySlice[2])
  otherSlice := []string{"Hi", "there"}
  fmt.Println(len(otherSlice))

  // Loop
  animals := []string{"Cat", "Dog", "Emu", "Warthg"}
  for i, animal := range animals {
    fmt.Println(animal, "is at index", i)
  }

  // Maps
  starWarsYears := map[string]int{
    "A New Hope": 1977,
    "The Empire Strikes Back": 1980,
    "Return of the Jedi": 1983,
    "Attack of the Clones": 2002,
    "Revenge of the Sith": 2005,
  }
  fmt.Println(len(starWarsYears))
  delete(starWarsYears, "A New Hope")
  for title, year := range starWarsYears {
    fmt.Println(title, "was released in", year)
  }

  // Structs
  type Movie struct {
    Actors []string
    Rating float32
    ReleaseYear int
    Title string
  }
  episodeIV := Movie{
    Title: "Star Wars: A New Hope",
    Rating: 5.0,
    ReleaseYear: 1977,
  }
  func (movie Movie) DisplayTitle() string {
    return fmt.Sprintf("%s (%d)", movie.Title, movie.ReleaseYear)
  }
  episodeIV.Actors = []string{
    "Mark Hamill",
    "Harrison Ford",
    "Carrie Fisher",
  }
  fmt.Println(episodeIV.Title, "has a rating of", episodeIV.Rating)

  someValue, err := doSomething()
  if err != nil {
    return err
  }


}

// Functions
func noParamsNoReturn() {
  fmt.Println("I'm not really doing much!")
}
func twoParamsOneReturn(myInt int, myString string) string {
  return fmt.Sprintf("myInt: %d, myString: %s", myInt, myString)
}
func oneParamTwoReturns(myInt int) (string, int) {
  return fmt.Sprintf("Int: %d", myInt), myInt + 1
}
func twoSameTypedParams(myString1, myString2 string) {
  fmt.Println("String 1", myString1)
  fmt.Println("String 2", myString2)
}

// Pointers
func giveMePear(fruit *string) {
  *fruit = "pear"
}

func doPear() {
  fruit := "banana"
  giveMePear(&fruit)
  fmt.Println(fruit)  // Outputs: pear
}

// defer
func CopyFle(dstName, srcName string) error {
  src, err := os.Open(srcName)
  if err != nil {
    return err
  }
  defer src.Close()
  dst, err := os.Open(dstName)
  if err != nil {
    return err
  }
  defer dst.Close()
  _, err := io.Copy(dst, src)
  return err
}
