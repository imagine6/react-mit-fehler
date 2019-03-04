import React, { Fragment, PureComponent } from "react";
import { Card, Image, Flex, Text, Button, Box } from "@rebass/emotion";
import { SubPageContainer } from "../../global/css";
import DonutChart from "../../components/DonutChart";
import Loader from "../../components/Loader";
import { FaGithub, FaYoutube } from "react-icons/fa";
import { MdDone, MdClose, MdAdd } from "react-icons/md";
import { api } from "../../lib/apisauce";
import "./buttons.scss";
import { isAuthenticated } from "../../helpers/isAuthenticated";
// import { isCompanyAuth } from "../../helpers/isCompanyAuth";

const leftCardWidthArray = [1, 1, 4 / 12, 4 / 12];
const rightCardWidthArray = [1, 1, 8 / 12, 8 / 12];

/**
 *
 *
 * @export
 * @class Profile
 * @extends {PureComponent}
 */
export default class Profile extends PureComponent {
  static displayName = "Profile";

  state = {
    student: [],
    sId: this.props.match.params.id,
    filterByTagsElem: this.props.location.state.filterByTagsElem,
    matchingVal: this.props.location.state.matchingVal,
    comment: "",
    sent: false,
    hideGetTouch: true,
    hideBio: false,
    hideVideo: true,
    youtubeVideoId: "",
    stackValue: "",
    filterValues: [],
    loading: true
  };

  componentDidMount() {
    this.fetchStudentByGitId();
    this.fetchStackItems();
  }

  render() {
    const { student, filterValues, loading } = this.state;

    if (!student.length) {
      console.error("Students array is empty");
      return null;
    }

    if (loading) {
      return (
        <Flex alignItems="center" justifyContent="center" mt="50%">
          <Loader />
        </Flex>
      );
    }

    return (
      <Fragment>
        <Flex>
        <SubPageContainer
          flexWrap="wrap"
          maxWidth="1140px"
          minHeight="calc(100vh - 90px)"
          isAuthenticated={isAuthenticated()}
        >
          <Card
            flex="1"
            mx="1rem"
            my="1rem"
            bg="white"
            width={leftCardWidthArray}
            borderRadius={4}
            boxShadow="0px 0px 4px #ccc"
          >
            <Flex
              p="1rem"
              flexDirection="row"
              width={[1]}
              justifyContent="center"
            >
              {!isAuthenticated() && (
                <DonutChart value={this.state.matchingVal} />
              )}
              <Image
                src={student[0].avatar_url}
                width={140}
                height={140}
                borderRadius={70}
                mt="1rem"
              />
            </Flex>
            {!isAuthenticated() && (
              <Flex p="1rem" flexDirection={"row"} width={[1]}>
                <Button
                  mx="0.5rem"
                  my="1rem"
                  fontSize="0"
                  width={[1 / 2]}
                  variant="secondary"
                  disabled="disabled"
                >
                  ADD TO WATCHLIST
                </Button>
                <Button
                  mx="0.5rem"
                  my="1rem"
                  fontSize="0"
                  width={[1 / 2]}
                  variant="primary"
                  onClick={this.toggleHiddenGetTouch}
                >
                  GET IN TOUCH
                </Button>
              </Flex>
            )}
            {!this.state.sent && !this.state.hideGetTouch && (
              <form onSubmit={this.handleSubmit}>
                <Flex
                  p="1rem"
                  flexDirection={"column"}
                  alignItems={"flex-end"}
                  width={[1]}
                >
                  <Text fontSize="1" flexWrap="nowrap">
                    Send message to {student[0].name}
                  </Text>
                  <textarea
                    rows="4"
                    name="comment"
                    value={this.state.comment.value}
                    onChange={this.changeHandler}
                    style={{
                      width: "100%",
                      border: "1px solid #d1d5da"
                    }}
                  />
                  <Button
                    mx="0.5rem"
                    my="1rem"
                    pt={0}
                    pb={0}
                    fontSize="0"
                    variant="secondary"
                    width={[4 / 12]}
                    style={{ paddingTop: "0", paddingBottom: "0" }}
                  >
                    SEND
                  </Button>
                </Flex>
              </form>
            )}
            {this.state.sent && (
              <Flex p="1rem" flexDirection={"column"} width={[1]}>
                <Text fontSize="1" flexWrap="nowrap">
                  Your message was sent, thank you!
                </Text>
              </Flex>
            )}
            <hr
              style={{
                border: "1px solid #eeeeee",
                boxShadow: "0px 0px 10px #f1f1f1"
              }}
            />
            {!isAuthenticated() && (
              <Flex p="1rem" flexDirection={"row"} width={[1]}>
                <Text fontSize="1" flexWrap="nowrap" mr="0.4em">
                  This student matches
                </Text>
                <Box
                  fontSize="1"
                  flexWrap="nowrap"
                  mr="0.4em"
                  style={{ color: "#00B5E7" }}
                >
                  {Math.round(
                    (this.state.filterByTagsElem.length *
                      this.state.matchingVal) /
                      100
                  )}{" "}
                  out of {this.state.filterByTagsElem.length}
                </Box>
                <Text fontSize="1" flexWrap="nowrap">
                  stack items
                </Text>
              </Flex>
            )}

            <Flex p="1rem" flexDirection={"row"} width={[1]} flexWrap="wrap">
              {student[0].stack.map(item => (
                <Button
                  pt="5px"
                  pl="0.5rem"
                  pr="0.5rem"
                  pb="0.5rem"
                  ml={"0.5rem"}
                  mb={"0.5rem"}
                  key={item}
                  variant={
                    this.state.filterByTagsElem.indexOf(item) > -1
                      ? "primary"
                      : "light"
                  }
                  borderRadius={50}
                  fontSize={0}
                  style={{ lineHeight: "0.5rem", paddingTop: "6px" }}
                >
                  {this.state.filterByTagsElem.indexOf(item) !== -1 && (
                    <MdDone />
                  )}
                  {item}
                </Button>
              ))}
              {student[0].additional_stack.map(item => (
                <Button
                  pt="5px"
                  pl="0.5rem"
                  pr="0.5rem"
                  pb="0.5rem"
                  ml={"0.5rem"}
                  mb={"0.5rem"}
                  key={item}
                  variant={
                    this.state.filterByTagsElem.indexOf(item) !== -1
                      ? "primary"
                      : "light"
                  }
                  borderRadius={50}
                  fontSize={0}
                  style={{ lineHeight: "0.5rem", paddingTop: "6px" }}
                >
                  {this.state.filterByTagsElem.indexOf(item) !== -1 && (
                    <MdDone />
                  )}
                  {item}{" "}
                  {isAuthenticated() && (
                    <MdClose onClick={() => this.handleDeleteStackItem(item)} />
                  )}
                </Button>
              ))}

              {isAuthenticated() && (
                <form onSubmit={this.handleSubmitStackItem}>
                  <Flex
                    p="1rem"
                    flexDirection={"row"}
                    alignItems={"flex-space"}
                    width={[1]}
                  >
                    <select
                      name="stackValue"
                      value={this.state.stackValue}
                      onChange={this.changeHandler}
                      style={{
                        color: "#212529",
                        fontWeight: "400",
                        backgroundColor: "#fff",
                        boxShadow: "1px 2px 10px -2px rgba(0,0,0,0.3)",
                        borderRadius: "3px",
                        transition: "all 375ms ease-in-out",
                        fontSize: "0.8rem",
                        lineHeight: "1.5",
                        height: "2rem"
                      }}
                    >
                      <option value="">Add Stack Item</option>
                      {filterValues.map(
                        filterItem =>
                          student[0].stack.indexOf(filterItem.id) === -1 &&
                          student[0].additional_stack.indexOf(filterItem.id) ===
                            -1 && (
                            <option
                              key={filterItem.id}
                              value={filterItem.id}
                              onChange={this.changeHandler}
                            >
                              {filterItem.id}
                            </option>
                          )
                      )}
                    </select>

                    <Button
                      mx="0.5rem"
                      pt="0px"
                      pb="0px"
                      fontSize="0"
                      variant="secondary"
                      width={[6 / 12]}
                      style={{ paddingTop: "4px", paddingBottom: "0px" }}
                    >
                      <MdAdd size={"15"} />
                    </Button>
                  </Flex>
                </form>
              )}
            </Flex>
            <hr
              style={{
                border: "1px solid #eeeeee",
                boxShadow: "0px 0px 10px #f1f1f1"
              }}
            />
            <Flex
              p="1rem"
              flexDirection="row"
              alignItems="center"
              width={[1]}
              justifyContent="center"
            >
              <FaGithub
                size={28}
                color={"#f1f1f1"}
                style={{ marginRight: "1rem" }}
              />
              <Text
                fontSize="1"
                fontWeight="bold"
                color="blue"
                style={{ marginRight: "1rem" }}
              >
                GITHUB
              </Text>
              <Text fontSize={1}>{student[0].login}</Text>
            </Flex>
          </Card>
          <Card
            flex="2"
            mx="1rem"
            my="1rem"
            p="1rem"
            bg="white"
            width={rightCardWidthArray}
            borderRadius={4}
            boxShadow="0px 0px 4px #ccc"
          >
            <Flex p="1rem" flexDirection={"row"} width={[1]}>
              <Text
                fontSize="1"
                fontWeight="bold"
                color={this.state.hideBio ? "dark" : "blue"}
                className={this.state.hideBio ? "notactive" : "active"}
                onClick={this.switchBioVideo}
              >
                BIO
              </Text>
              <Text
                fontSize="1"
                fontWeight="bold"
                color={this.state.hideVideo ? "dark" : "blue"}
                className={this.state.hideVideo ? "notactive" : "active"}
                onClick={this.switchBioVideo}
              >
                VIDEO
              </Text>
            </Flex>
            <Flex
              p="1rem"
              flexDirection={"row"}
              width={[1]}
              justifyContent="space-between"
            >
              <Flex flexDirection={"row"}>
                <Image
                  src={student[0].avatar_url}
                  borderRadius={70}
                  width={60}
                  height={60}
                  mr="1rem"
                />
                <Text fontWeight="bold" color="dark" fontSize="3">
                  {student[0].name !== "null"
                    ? student[0].name
                    : "Name not set"}{" "}
                  <br />
                </Text>
              </Flex>
              {/* TODO discuss if CV should be in or not
              <Button
                fontSize="0"
                style={{ height: "fit-content" }}
                py="0.8rem"
                px="2rem"
                variant="primary"
              >
                <MdAttachFile /> GET CV
              </Button>
              */}
            </Flex>

            <Flex p="1rem" width={[1]}>
              <Flex flexDirection={"column"} width={[1]}>
                <hr
                  style={{
                    border: "1px solid #f1f1f1",
                    width: "100%",
                    margin: 0
                  }}
                />
                <Flex pt="0.5rem" pb="0.5rem" flexDirection={"row"} width={[1]}>
                  <Text color="blue" fontSize="0" fontWeight="bold" mr="0.5rem">
                    LOCATION
                  </Text>
                  <Text color="dark" fontSize="0" mr="3rem">
                    {student[0].location !== "null"
                      ? student[0].location
                      : "not set"}
                  </Text>
                </Flex>
                <hr
                  style={{
                    border: "1px solid #f1f1f1",
                    width: "100%",
                    margin: 0
                  }}
                />
                {!this.state.hideBio && this.renderBio(student)}
                {!this.state.hideVideo && this.renderVideo(student)}
              </Flex>
            </Flex>
          </Card>
        </SubPageContainer>
      </Fragment>
    );
  }

  changeHandler = event => {
    const name = event.target.name;
    const value = event.target.value;

    this.setState({
      [name]: value
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    this.sendGetInTouchMail();
  };

  handleSubmitStackItem = event => {
    event.preventDefault();
    this.updateAdditionalStack(this.state.stackValue);
  };

  handleSubmitVideo = event => {
    event.preventDefault();
    this.updateVideoId(this.state.youtubeVideoId);
    this.fetchStudentByGitId();
  };

  handleDeleteVideo = event => {
    event.preventDefault();
    this.updateVideoId("delete");
    this.setState({ youtubeVideoId: "" });
    this.fetchStudentByGitId();
  };

  handleDeleteStackItem = item => {
    this.deleteStackItem(item);
  };

  toggleHiddenGetTouch = event => {
    this.setState({
      hideGetTouch: !this.state.hideGetTouch
    });
  };

  switchBioVideo = event => {
    this.setState({
      hideBio: !this.state.hideBio,
      hideVideo: !this.state.hideVideo
    });
  };

  /**
   *
   * @method renderBio
   * @memberof Header
   * @returns {ReactDOM}
   */
  renderBio = student => {
    let bio = (
      <Text pt="2rem" fontSize="1">
        {student[0].bio !== "null" ? student[0].bio : "not set"}
      </Text>
    );

    return bio;
  };

  /**
   *
   * @method renderBio
   * @memberof Header
   * @returns {ReactDOM}
   */
  renderVideo = student => {
    var link = "https://www.youtube.com/embed/" + this.state.student[0].videoid;
    let video = (
      <Flex flexDirection={"column"} width={[1]}>
        {this.state.student[0].videoid && (
          <Flex mt="1rem">
            <iframe
              title="youtube"
              width="560"
              height="315"
              src={link}
              frameBorder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </Flex>
        )}
        {!this.state.student[0].videoid && (
          <Flex flexDirection="column" width={[1]}>
            <FaYoutube size="50" style={{ paddingTop: "2rem" }} />
            <Text fontSize="1">
              No video available. {this.state.student[0].videoid}
            </Text>
          </Flex>
        )}
        {isAuthenticated() && !this.state.student[0].videoid && (
          <form onSubmit={this.handleSubmitVideo}>
            <Flex pt="1rem" flexDirection={"column"} width={[1]}>
              <Text fontSize="1" flexWrap="nowrap">
                Insert youtube Video ID here:
              </Text>
              <textarea
                rows="1"
                name="youtubeVideoId"
                value={this.state.youtubeVideoId.value}
                onChange={this.changeHandler}
                style={{
                  width: "50%",
                  border: "1px solid #d1d5da"
                }}
              />
              <Button
                my="1rem"
                pt={0}
                pb={0}
                fontSize="0"
                variant="secondary"
                width={[4 / 12]}
                style={{ paddingTop: "0", paddingBottom: "0" }}
              >
                SAVE
              </Button>
            </Flex>
          </form>
        )}
        {isAuthenticated() && this.state.student[0].videoid && (
          <Flex pt="1rem" flexDirection={"column"} width={[1]}>
            <Button
              my="1rem"
              pt={0}
              pb={0}
              fontSize="0"
              variant="secondary"
              width={[4 / 12]}
              style={{ paddingTop: "0", paddingBottom: "0" }}
              onClick={this.handleDeleteVideo}
            >
              DELETE VIDEO
            </Button>
          </Flex>
        )}
      </Flex>
    );

    return video;
  };

  /**
   *
   * @method fetchStudentById
   * @memberof Profile
   * WIP
   */
  fetchStudentById = async event => {
    this.setState({ loading: true });

    const sId = this.state.sId;
    const response = await api.post(
      "https://www.codedoor.org/api/getStudentById.php",
      sId,
      { headers: { "Content-Type": "application/json" } }
    );
    const { ok, data } = response || {};
    if (ok) {
      this.setState({ student: data.results, loading: false });
    } else {
      // hide loader
      this.setState({ loading: false });
      // handle api call error
      if (process.env.REACT_APP_DEBUG === true) {
        console.error("fetchUserData() Error", { data });
      }
    }
  };

  /**
   *
   * @method fetchStudentByGitId
   * @memberof Profile
   * WIP
   */
  fetchStudentByGitId = async () => {
    this.setState({ loading: true });

    const sId = this.state.sId;
    const response = await api.post(
      "https://www.codedoor.org/api/getStudentByGitId.php",
      sId
    );
    const { ok, data } = response || {};
    if (ok) {
      this.setState({ student: data.results, loading: false });
    } else {
      // hide loader
      this.setState({ loading: false });
      // handle api call error
      if (process.env.REACT_APP_DEBUG === true) {
        console.error("fetchStudentByGitId() Error", { data });
      }
    }
  };

  /**
   *
   * @method sendGetInTouchMail
   * @memberof Profile
   * WIP
   */
  sendGetInTouchMail = async () => {
    const comment = this.state.comment;
    const email = this.state.student[0].email;
    const response = await api.post(
      "https://www.codedoor.org/api/sendGetInTouchMail.php",
      { comment, email }
    );
    const { ok, data } = response || {};
    if (ok) {
      this.setState({ sent: true });
    } else {
      // handle api call error
      if (process.env.REACT_APP_DEBUG === true) {
        console.error("sendGetInTouchMail() Error", { data });
      }
    }
  };

  /**
   *
   * @method updateVideoId
   * @memberof Profile
   * WIP
   */
  updateVideoId = async youtubeVideoId => {
    const gitid = this.state.sId;
    const response = await api.post(
      "https://www.codedoor.org/api/putVideoId.php",
      { youtubeVideoId, gitid }
    );
    const { ok, data } = response || {};
    if (ok) {
      if (youtubeVideoId === "delete") {
        youtubeVideoId = "";
      }
      this.setState({ youtubeVideoId: youtubeVideoId });
    } else {
      // handle api call error
      if (process.env.REACT_APP_DEBUG === true) {
        console.error("updateVideoId() Error", { data });
      }
    }
  };

  /**
   *
   * @method updateAdditionalStack
   * @memberof Profile
   * WIP
   */
  updateAdditionalStack = async additionalStack => {
    const gitid = this.state.sId;
    const response = await api.post(
      "https://www.codedoor.org/api/putAdditionalStack.php",
      { additionalStack, gitid }
    );
    const { ok, data } = response || {};
    if (ok) {
      this.setState({ stackValue: additionalStack });
      this.fetchStudentByGitId();
    } else {
      // handle api call error
      if (process.env.REACT_APP_DEBUG === true) {
        console.error("updateAdditionalStack() Error", { data });
      }
    }
  };

  /**
   *
   * @method deleteStackItem
   * @memberof Profile
   * WIP
   */
  deleteStackItem = async additionalStack => {
    const gitid = this.state.sId;
    const response = await api.post(
      "https://www.codedoor.org/api/updateStackItem.php",
      { additionalStack, gitid }
    );
    const { ok, data } = response || {};
    if (ok) {
      this.setState({ stackValue: additionalStack });
      this.fetchStudentByGitId();
    } else {
      // hide loader
      this.setState({ loading: false });
      // handle api call error
      if (process.env.REACT_APP_DEBUG === true) {
        console.error("updateAdditionalStack() Error", { data });
      }
    }
  };

  /**
   *
   * @method fetchStackItems
   * @memberof Matching
   * WIP
   */
  fetchStackItems = async () => {
    this.setState({ loading: true });

    const response = await api.get(
      "https://www.codedoor.org/api/getStackItems.php"
    );
    const { ok, data } = response || {};
    if (ok) {
      this.setState({ filterValues: data.results, loading: false });
    } else {
      // hide loader
      this.setState({ loading: false });
      // handle api call error
      if (process.env.REACT_APP_DEBUG === true) {
        console.error("fetchUserData() Error", { data });
      }
    }
  };
}
