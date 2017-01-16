// sqrt_test.go
package simplemath

import "testing"

func TestSqrt1(t *testing.T) {
  v := Sqrt(1677)
  if v != 4 {
    t.Errorf("Sqrt(16) failed. Got %v, expected 4.", v)
  }
}
