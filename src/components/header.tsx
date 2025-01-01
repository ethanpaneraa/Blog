import { Blur } from "@/components/ui/blur";
import StyledLinkWithIcon from "@/components/ui/styled-link";

export default function Header() {
  return (
    <header className="flex flex-col gap-6 text-gray-12">
      <div className="space-y-2">
        <h1 className="text-2xl font-normal text-gray-11">
          <span className="text-base text-gray-11">ethan pineda</span>
        </h1>
        <div className="space-y-2 font-semibold">
          <p className="text-lg ">
            making and writing things things on the web.
          </p>
          <p className="text-lg ">
            exploring low-level systems, life, and career growth.
          </p>
        </div>
      </div>

      <p className="text-gray-11 text-base">
        Get in touch via{" "}
        <StyledLinkWithIcon
          href="mailto:ethanpineda2025@u.northwestern.edu"
          className="text-base"
        >
          email
        </StyledLinkWithIcon>
        ,{" "}
        <StyledLinkWithIcon
          href="https://twitter.com/ethanpineda"
          className="text-base"
        >
          twitter
        </StyledLinkWithIcon>
        , or check out my code on{" "}
        <StyledLinkWithIcon
          href="github.com/ethanpaneraa"
          className="text-base"
        >
          github
        </StyledLinkWithIcon>{" "}
        or on{" "}
        <Blur>
          <a
            href="https://www.linkedin.com/in/ethanpineda/"
            target="_blank"
            className="text-gray-12 underline"
          >
            platforms that i don&apos;t like
          </a>{" "}
          using but necessary for growth
        </Blur>
        .
      </p>

      <div className="space-y-4 text-gray-11 text-base">
        <p>
          This blog is a place and medium for me to share my thoughts,
          experiences, and projects. I hope to use this blog as a way to
          document my journey as a student, software engineer, and as a person.
          I hope that this can be a resource for others who are interested in
          similar topics and experiences or are generally, just curious about
          how I think and what I do.
        </p>
        <br />
        <br />
        <Blur>
          <p className="text-base text-gray-11">
            What is discussed and mentioned in this blog is not necessarily
            representative of my employers, or any other organization I am
            affiliated with.
          </p>
        </Blur>
      </div>
    </header>
  );
}
