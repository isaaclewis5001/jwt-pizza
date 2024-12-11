

| Item           | Result                                                                         |
| -------------- | ------------------------------------------------------------------------------ |
| Date           | December 12, 2024                                                              |
| Target         | pizza-service.pizzasco.lol                                                     |
| Classification | Insecure Design                                                                |
| Severity       | 1                                                                              |
| Description    | Prices based on HTTP request values, not menu listings. Revenue lost.          |
| Images         | ![Negative cost](exploit.png) <br/>                                            |
| Corrections    | Verify order prices against the menu.                                          |
