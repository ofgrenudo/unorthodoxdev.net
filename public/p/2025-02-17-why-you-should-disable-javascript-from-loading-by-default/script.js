function showImage() {
    document.getElementById("soon_to_be_vuln").innerHTML = "<svg width=\"100\" height=\"100\" xmlns=\"http://www.w3.org/2000/svg\" onmouseover=\"javascript:alert(String.fromCharCode(88,83,83))\">    <circle cx=\"50\" cy=\"50\" r=\"40\" stroke=\"black\" stroke-width=\"3\" fill=\"red\" /></svg> <br>";
}